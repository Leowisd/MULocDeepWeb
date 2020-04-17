// custom-file-input displays the name of uploaded
$('.custom-file-input').on('change', function () {
    let fileName = $(this).val().split('\\').pop();
    $(this).next('.custom-file-label').addClass("selected").html(fileName);
});

// reset button clears the file name 
$('#reset').click(function () {
    $('#fileLabel').text('Choose file');
})

$('#sample').click(function () {
    $('#sequenceInput').val('>P03070\nMDKVLNREESLQLMDLLGLERSAWGNIPLMRKAYLKKCKEFHPDKGGDEEKMKKMNTLYKKMEDGVKYAHQPDFGGFWDATEIPTYGTDEWEQWWNAFNEENLFCSEEMPSSDDEATADSQHSTPPKKKRKVEDPKDFPSELLSFLSHAVFSNRTLACFAIYTTKEKAALLYKKIMEKYSVTFISRHNSYNHNILFFLTPHRHRVSAINNYAQKLCTFSFLICKGVNKEYLMYSALTRDPFSVIEESLPGGLKEHDFNPEEAEETKQVSWKLVTEYAMETKCDDVLLLLGMYLEFQYSFEMCLKCIKKEQPSHYKYHEKHYANAAIFADSKNQKTICQQAVDTVLAKKRVDSLQLTREQMLTNRFNDLLDRMDIMFGSTGSADIEEWMAGVAWLHCLLPKMDSVVYDFLKCMVYNIPKKRYWLFKGPIDSGKTTLAAALLELCGGKALNVNLPLDRLNFELGVAIDQFLVVFEDVKGTGGESRDLPSGQGINNLDNLRDYLDGSVKVNLEKKHLNKRTQIFPPGIVTMNEYSVPKTLQARFVKQIDFRPKDYLKHCLERSEFLLEKRIIQSGIALLLMLIWYRPVAEFAQSIQSRIVEWKERLDKEFSLSVYQKMKFNVAMGIGVLDWLRNSDDDDEDSQENADKNEDGGEKNMEDSGHETGIDSQSQGSFQAPQSSQSVHDHNQPYHICRGFTCFKKPPTPPPEPET\n>P10238\nMATDIDMLIDLGLDLSDSDLDEDPPEPAESRRDDLESDSSGECSSSDEDMEDPHGEDGPEPILDAARPAVRPSRPEDPGVPSTQTPRPTERQGPNDPQPAPHSVWSRLGARRPSCSPEQHGGKVARLQPPPTKAQPARGGRRGRRRGRGRGGPGAADGLSDPRRRAPRTNRNPGGPRPGAGWTDGPGAPHGEAWRGSEQPDPPGGQRTRGVRQAPPPLMTLAIAPPPADPRAPAPERKAPAADTIDATTRLVLRSISERAAVDRISESFGRSAQVMHDPFGGQPFPAANSPWAPVLAGQGGPFDAETRRVSWETLVAHGPSLYRTFAGNPRAASTAKAMRDCVLRQENFIEALASADETLAWCKMCIHHNLPLRPQDPIIGTTAAVLDNLATRLRPFLQCYLKARGLCGLDELCSRRRLADIKDIASFVFVILARLANRVERGVAEIDYATLGVGVGEKMHFYLPGACMAGLIEILDTHRQECSSRVCELTASHIVAPPYVHGKYFYCNSLF\n>P09462\nMMSFVSLLLVGILFHATQAEQLTKCEVFQELKDLKDYGGVSLPEWVCTAFHTSGYDTQAIVQNNDSTEYGLFQINNKIWCKDDQNPHSRNICNISCDKFLDDDLTDDIMCVKKILDKVGINYWLAHKALCSEKLDQWLCEKL\n>P04037\nMLSLRQSIRFFKPATRTLCSSRYLLQQKPVVKTAQNLAEVNGPETLIGPGAKEGTVPTDLDQETGLARLELLGKLEGIDVFDTKPLDSSRKGTMKDPIIIESYDDYRYVGCTGSPAGSHTIMWLKPTVNEVARCWECGSVYKLNPVGVPNDDHHH\n>P11893\nMVAMAMASLQSSMSSLSLSSNSFLGQPLSPITLSPFLQGKPTEKKCLIVMKLKRWERKECKPNSLPVLHKLHVKVGDTVKVISGHEKGQIGEITKIFKHNSSVIVKDINLKTKHVKSNQEGEPGQINKVEAPIHSSNVMLYSKEKDVTSRVGHKVLENGKRVRYLIKTGEIIDSEENWKKLKEANKKTAEVAAT');
    $('#nickName1').val('Example Case');
    $('#emailInput1').val('examplecase@MULocDeep.com');
})

function checkSeqValid() {
    let data = $('#sequenceInput').val().trim().split('\n');
    // console.log(data);
    for (let i = 0; i < data.length; i++) {

        if (!data[i]){
            $('#errorModalBody').text("Sequences are not valid.");
            $('#errorModal').modal('show');
            return false;
        }
        data[i] = data[i].trim();
        if (!data[i]){
            $('#errorModalBody').text("Sequences are not valid.");
            $('#errorModal').modal('show');
            return false;
        }

        if (i % 2 == 0) {
            if (data[i][0] != '>') {
                $('#errorModalBody').text("The name of sequence " + data[i] + " is not valid.");
                $('#errorModal').modal('show');
                return false;
            }
        }
        else {
            if (data[i].search(/[^ACDEFGHIKLMNPQRSTUVWY\s]/i) != -1) {
                $('#errorModalBody').text("The sequence " + data[i - 1] + " is not valid. Please check and input valid sequence(s).");
                $('#errorModal').modal('show');
                return false;
            }
        }
    }
    if (data.length > 50) {
        $('#errorModalBody').text("The number of sequences: " + data.length / 2 + " is out of the limit: 25");
        $('#errorModal').modal('show');
        return false;
    }
}

function checkFileValid() {
    let objFile = document.getElementById("fileSelect");

    // console.log(objFile.files[0].size); // 文件字节数

    let files = $('#fileSelect').prop('files');//获取到文件列表

    let reader = new FileReader();//新建一个FileReader
    reader.readAsText(files[0], "UTF-8");//读取文件
    reader.onload = function (evt) { //读取完文件之后会回来这里
        let data = evt.target.result.trim().split('\n'); // 读取文件内容
        for (let i = 0; i < data.length; i++) {

            if (!data[i]){
                $('#errorModalBody').text("Sequences are not valid.");
                $('#errorModal').modal('show');
                document.getElementById("reset").click();
            };
            data[i] = data[i].trim();
            if (!data[i]) {
                $('#errorModalBody').text("Sequences are not valid.");
                $('#errorModal').modal('show');
                document.getElementById("reset").click();
            };

            if (i % 2 == 0) {
                if (data[i][0] != '>') {
                    $('#errorModalBody').text("The name of sequence " + data[i] + " is not valid.");
                    $('#errorModal').modal('show');
                    document.getElementById("reset").click();
                }
            }
            else {
                if (data[i].search(/[^ACDEFGHIKLMNPQRSTUVWY\s]/i) != -1) {
                    $('#errorModalBody').text("The sequence " + data[i - 1] + " is not valid. Please check and input valid sequences.");
                    $('#errorModal').modal('show');
                    document.getElementById("reset").click();
                }
            }
        }
        if (data.length > 50) {
            $('#errorModalBody').text("The number of sequences " + data.length / 2 + " is out of the limit: 25.");
            $('#errorModal').modal('show');
            document.getElementById("reset").click();
        }
    }
}